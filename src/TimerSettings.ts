interface TimerSettings {
  TWENTY_MINUTES: number;
  BREAK_TIME: number;
  STROKE_LENGTH: number;
  SMALL_SCREEN: number;
  NOTIFICATION_BREAK_START: string;
  NOTIFICATION_BREAK_FINISH: string;
  NOTIFICATION_DISPLAY_TIME: number;
  ALARM_SOUND: string;
  ALARM_TIME: number;
  ALARM_VOLUME: number;
  IS_CONTINUOUS: boolean;
  REPEAT_NUMBER: number;
}

export const TimerSettings: TimerSettings = {
  TWENTY_MINUTES: 1,
  BREAK_TIME: 2,
  STROKE_LENGTH: 595,
  SMALL_SCREEN: 768,
  NOTIFICATION_BREAK_START: 'Break time starts',
  NOTIFICATION_BREAK_FINISH: 'Break time is over!',
  NOTIFICATION_DISPLAY_TIME: 5000,
  ALARM_SOUND: 'break-music.mp3',
  ALARM_TIME: 20,
  ALARM_VOLUME: 0.5,
  IS_CONTINUOUS: true,
  REPEAT_NUMBER: 10,
};
