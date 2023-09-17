interface TimerSettings {
  TWENTY_MINUTES: number;
  TWENTY_SECONDS: number;
  SMALL_SCREEN: number;
  NOTIFICATION_BREAK_START: string;
  NOTIFICATION_BREAK_FINISH: string;
  NOTIFICATION_DISPLAY_TIME: number;
  ALARM_SOUND: string;
  ALARM_SOUNDS: string[];
  ALARM_VOLUME: number;
  IS_CONTINUOUS: boolean;
}

export const TimerSettings: TimerSettings = {
  TWENTY_MINUTES: 1200,
  TWENTY_SECONDS: 20,
  SMALL_SCREEN: 768,
  NOTIFICATION_BREAK_START: 'Break time starts',
  NOTIFICATION_BREAK_FINISH: 'Break time is over!',
  NOTIFICATION_DISPLAY_TIME: 5000,
  ALARM_SOUND: 'default-alarm-sound.mp3',
  ALARM_SOUNDS: [],
  ALARM_VOLUME: 0.1,
  IS_CONTINUOUS: true,
};
