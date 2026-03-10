---
index: false
title: 基础
---

这里是基础篇下的README.md









第一阶段：进站与绑定 (Arrival & Binding)
1. AGV 到达 :
   - 物理层 : AGV 到达工位，PLC 的传感器可能会感应到。
   - 通讯层 : 服务端（SignalR）可能会推送消息给客户端，触发 CatchAgvMessage 方法。
   - 动作 : 客户端更新 App.AGVCode ，显示“AGV在位”。
2. 请求绑定 :
   - 逻辑 : 客户端调用 DealBindAGV 。
   - 交互 (Client -> PLC) : 客户端向 PLC 写入绑定请求信号 ( MST_AGVBindPack_Req )，告诉 PLC：“AGV来了，车号是X，上面的产品条码是Y，请确认”。
   - 反馈 (PLC -> Client) : PLC 确认无误后，反馈 DEV_AGVBindPack_Ack （绑定确认），此时物理上可能会锁定 AGV。 第二阶段：工艺验证 (MES Validation)
1. 进站校验 :
   - 逻辑 : 客户端拿到条码后，调用 DealMesInSite 。
   - 交互 (Client -> MES) : 客户端问 MES：“这个条码的产品能在这个工位做吗？”
   - 反馈 (MES -> Client) : MES 返回“允许”或“拒绝”。如果允许，还会下发对应的 配方（Formula） （比如螺丝要拧多紧）。 第三阶段：作业执行 (Working)
1. 控制设备 :
   - 交互 : 客户端根据 MES 下发的配方，控制拧紧枪或提示工人操作。
   - 交互 (Client <-> PLC) : 作业过程中，客户端可能会读取 PLC 状态（如急停按钮是否按下），或者写入信号控制指示灯。 第四阶段：离站与放行 (Departure & Release)
1. 上传数据 :
   - 逻辑 : 作业完成后（如 LetGoPage.xaml.cs 中的 CatchIOMessage ），客户端调用 BuildAndUpMesData 。
   - 交互 (Client -> MES) : 将最终的拧紧数据、过站结果上传给 MES 存档。
2. 请求放行 :
   - 前提 : 只有 MES 上传成功，才允许放行。
   - 交互 (Client -> PLC) : 客户端向 PLC 写入放行信号 ( MST_ReleaseAGV_Req )，告诉 PLC：“活干完了，打开阻挡器，让车走”。
3. 物理离站 :
   - 动作 : PLC 打开阻挡器，AGV 驶离。
   - 交互 (PLC -> Client) : PLC 检测到 AGV 离开，更新状态 DEV_AGVStatus_AGVLeaving 。
   - 通讯层 : 服务端推送 AgvActionEnum.离站 ，客户端清空界面的 AGV 信息。







你在调试时，可以在代码中搜索这些关键字来追踪它们的交互：

- Client <-> PLC :
  - _stationPLCContext : 所有 PLC 信号的中转站。
  - MST_... : Master(客户端) 发送给 PLC 的信号（如 MST_ReleaseAGV_Req ）。
  - DEV_... : Device(PLC) 发送给 客户端的信号（如 DEV_AGVArrive_Req ）。
- Client <-> MES :
  - UploadCATLData : 上传给 MES 的数据结构。
  - DealMesInSite : 进站校验逻辑。
- Client <-> AGV :
  - AgvMsgNotification : 接收 AGV 状态变化的通知类。
  - CatchAgvMessage : 处理 AGV 消息的方法。













总体流程

- 进入放行任务页面时自动上传 CATL MES。
- 上传成功后，提示“请放行”，并对 PLC/IO 发放行允许信号。
- 操作员按放行按钮（或物理 IO 触发）→ 保存“放行完成”到服务端 → 驱动 AGV 离站。
- 上传失败时，发报警（UI显示/暂停生产）、IO蜂鸣器响，需复位或重试上传。
页面加载：自动上传 MES

- 入口事件： LetGoPage.StationTaskCommonPage_Loaded
  - 在 Loaded 时异步执行 BuildAndUpMesData() ，仅当非 Debug 且尚未上传。
- 数据构建与上传：
  - BuildUpMesCollectData ：从 API 收集“待上传收数数据”，缓存到 App.UpCatlMesData ；若超时（Code=500）弹窗提示并重试。
  - UpMes ：调用 CallCatlMesCollectDataFucAsync 执行 CatlMesInvoker.dataCollect(...) 。
    - 成功： HasUpMesOK = true ；提示文本换为“数据上传完成，请放行小车！”且为绿色；关键：置位 _stationPLCContext.LetGo = true ，向 PLC/IO 表示“允许放行”。
    - 失败： HasUpMesOK = false ；提示为红色“上传出错，请重试！”；同时发布 AlarmSYSNotification: CatlMES错误 ，进入报警流程。
    放行动作：UI按钮与物理 IO 两条通道

- UI按钮：
  - LetGoPage.Btn_RunAGV 直接调用 _VM.OnCompleteTask(StationTaskDTO) 触发任务完成。
- 物理 IO（面板“放行”按钮或 PLC 信号）：
  - PLC状态触发： IOBoxBusinessProcess.Process → notification.LetGo
    - 若当前页面是 LetGoPage，则调用 LetGoPage.CatchIOMessage(IOEnum.放行) 。
    - CatchIOMessage 逻辑：
      - 若尚未上传（ HasUpMesOK 为 false），先尝试再次上传；仍不成功则直接 return，不允许放行。
      - 若该放行任务此前“保存成功但放行AGV失败”，则 StationTaskDTO.HasFinish = true ，再次按放行直接调用 Vm.DealRunAGV 去触发 AGV 离站，无需重复保存。
      - 否则，在有 PackBarCode 的前提下调用 _VM.OnCompleteTask(StationTaskDTO) 走“保存并放行”的标准路径。
      任务完成：保存与驱动 AGV 离站

- 完成事件总线： TaskViewModelBase.OnCompleteTask 会调用 RealtimePage.RealtimePage_CompleteTask 。
  - 放行类型任务（LetGo）：调用 SetStationCurTaskRunAGV ，即 APIHelper.SetStationCurTaskRunAGV 记录放行。
  - 保存成功：
    - 若所有工步已完成：对于线内人工站，调用 Vm.DealRunAGV 。
      - DealRunAGV 会向 _stationPLCContext.ReleaseAGVReqs 添加请求项，PLC 中间件识别后发送“AGV离站”动作，随后服务端 AGVController.AGVLeaved 记录并广播离站消息。
    - 若还有未完成工步：跳到下一个未完成任务（ GoNextUndoTask ）。
  - 保存失败：发布 AlarmSYSNotification: AGV错误/系统运行错误 。
  失败路径：报警与蜂鸣器

- 上传 MES 失败或保存失败都会发布 AlarmSYSNotification，由 AlarmNotificationHandler 更新 UI 报警列表，并设置：
  - App.StationTaskNGPause = true （暂停生产流转）
  - _stationPLCContext.Alarm = true （硬件报警）
- IO 侧处理报警： IOBoxBusinessProcess.MakesAlarm 控制蜂鸣器与红灯（现场版本对应 DO 输出），直到复位清除。
补充：手动重试与手动完成

- 手动重传按钮： LetGoPage.ReUploadMes ：在未上传成功且非 Debug 时重新执行 BuildAndUpMesData() 。
- 手动完成按钮： LetGoPage.SetComplete ：如果未上传成功仍强制完成，会记录警告日志，并将 HasUpMesOK 置为 true（仅页面内部状态），后续再走保存→放行逻辑。
整体上，这段放行逻辑把“MES上传结果”和“是否允许放行”强绑定，确保只有在数据已成功上报的前提下，才向 PLC/IO 下发放行信号并允许 AGV 离站；一旦失败，则进入报警与蜂鸣器，等待复位或重试。
