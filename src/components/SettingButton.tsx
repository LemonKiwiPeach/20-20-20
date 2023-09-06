import React, { useState, ChangeEvent } from "react";
import "../styles/SettingButton.css";
import { TimerSettings } from "../TimerSettings";

const SettingButton = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>(
    TimerSettings.NOTIFICATION_BREAK_START
  );
  const [notificationDisplayTime, setNotificationDisplayTime] = useState<number>(5);
  const [alarmSound, setAlarmSound] = useState<File | null>(null);
  const [alarmTime, setAlarmTime] = useState<number>(20);
  const [alarmVolume, setAlarmVolume] = useState<number>(0.1);
  const [selectedSettingItem, setSelectedSettingItem] = useState<string>("notification");

  // Notification message
  const handleNotificationMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setNotificationMessage(e.target.value);
  };

  // Notification display time
  const handleNotificationDisplayTime = (e: ChangeEvent<HTMLInputElement>) => {
    setNotificationDisplayTime(parseInt(e.target.value));
  };

  // Alarm sound
  const handleAlarmSound = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log(files[0]);
      setAlarmSound(files[0]);
    }
  };

  // Alarm time
  const handleAlarmTime = (e: ChangeEvent<HTMLInputElement>) => {
    setAlarmTime(parseInt(e.target.value));
  };

  // Alarm volume
  const handleAlarmVolume = (e: ChangeEvent<HTMLInputElement>) => {
    setAlarmVolume(parseInt(e.target.value));
  };

  return (
    <>
      <div className="setting-button" onClick={() => setDialogOpen(true)}>
        <i className={`fa fa-2x fa-gear`}></i>
      </div>
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="close-button" onClick={() => setDialogOpen(false)}>
              ×
            </div>
            <h2>Settings</h2>
            <div className="settings-wrapper">
              <aside>
                <div
                  className={`settings-section ${
                    selectedSettingItem === "notification" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSettingItem("notification")}
                >
                  通知
                </div>
                <div
                  className={`settings-section ${
                    selectedSettingItem === "alarm" ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSettingItem("alarm")}
                >
                  アラーム
                </div>
              </aside>
              <section>
                {selectedSettingItem === "notification" && (
                  <>
                    <div className="settings-item">
                      <label htmlFor="notificationMessage">通知メッセージ</label>
                      <input
                        type="text"
                        id="notificationMessage"
                        value={notificationMessage}
                        onChange={handleNotificationMessage}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="notificationDisplayTime">表示時間</label>
                      <input
                        type="number"
                        id="notificationDisplayTime"
                        value={notificationDisplayTime}
                        onChange={handleNotificationDisplayTime}
                      />
                    </div>
                  </>
                )}

                {selectedSettingItem === "alarm" && (
                  <>
                    <div className="settings-item">
                      <label>アラーム音</label>
                      <label htmlFor="alarmSound" className="custom-file-upload">
                        Choose File
                      </label>
                      <input
                        type="file"
                        id="alarmSound"
                        accept="audio/*"
                        onChange={handleAlarmSound}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="alarmTime">アラーム時間</label>
                      <input
                        type="number"
                        id="alarmTime"
                        value={alarmTime}
                        onChange={handleAlarmTime}
                      />
                    </div>
                    <div className="settings-item">
                      <label htmlFor="alarmVolume">音量</label>
                      <input
                        type="number"
                        id="alarmVolume"
                        value={alarmVolume}
                        onChange={handleAlarmVolume}
                      />
                    </div>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingButton;
