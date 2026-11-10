import {isOverdue,toICS,type Task} from './domain';
/** Channels consume the same local tasks; none silently enables background push. */
export interface ReminderProvider {id:string; background:boolean; prepare(tasks:Task[]):{count:number;content?:string}}
export const inAppReminders:ReminderProvider={id:'in-app',background:false,prepare:tasks=>({count:tasks.filter(t=>isOverdue(t)).length})};
export const calendarReminders:ReminderProvider={id:'calendar-ics',background:false,prepare:tasks=>({count:tasks.filter(t=>!t.completedAt).length,content:toICS(tasks)})};
