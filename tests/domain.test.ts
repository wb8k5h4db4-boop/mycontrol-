import {describe,it,expect,beforeEach} from 'vitest';
import {taskSchema,nextDate,backupSchema,toICS,defaultSettings} from '../src/domain';
import {db,completeTask,reopenTask,exportBackup,restoreBackup} from '../src/db';
const task=(change={})=>taskSchema.parse({id:crypto.randomUUID(),title:'Проверить магазин',description:'План; закупки, оплата\nДетали',date:'2026-01-31',time:'12:30',priority:'high',category:'Магазин',repeat:'monthly',interval:1,weekdays:[],anchorDay:31,createdAt:new Date().toISOString(),completedAt:null,...change});
beforeEach(async()=>{await db.tasks.clear();await db.settings.clear()});
describe('Расписание',()=>{
it('сохраняет число месяца после февраля',()=>{const t=task();expect(nextDate(t)).toBe('2026-02-28');expect(nextDate({...t,date:'2026-02-28'})).toBe('2026-03-31')});
it('учитывает високосный год',()=>expect(nextDate(task({date:'2028-01-31'}))).toBe('2028-02-29'));
it('находит выбранный день недели',()=>expect(nextDate(task({date:'2026-11-10',repeat:'weekdays',weekdays:[1,5]}))).toBe('2026-11-13'));
it('считает произвольный интервал и переход года',()=>expect(nextDate(task({date:'2026-12-31',repeat:'interval',interval:3}))).toBe('2027-01-03'));
it('отклоняет несуществующие даты и пустые дни недели',()=>{expect(()=>task({date:'2026-02-30'})).toThrow();expect(()=>task({repeat:'weekdays'})).toThrow()});
});
describe('Хранение и копии',()=>{
it('атомарно выполняет и создаёт только один повтор',async()=>{const t=task();await db.tasks.add(t);await Promise.all([completeTask(t.id),completeTask(t.id)]);expect(await db.tasks.count()).toBe(2);const child=await db.tasks.where('parentId').equals(t.id).first();expect(child?.date).toBe('2026-02-28');await reopenTask(t.id);expect(await db.tasks.count()).toBe(1);expect((await db.tasks.get(t.id))?.completedAt).toBeNull()});
it('сохраняет всю историю при круговом восстановлении',async()=>{const t=task();await db.tasks.add(t);await completeTask(t.id);const raw=await exportBackup();await db.tasks.clear();await restoreBackup(raw);expect(await db.tasks.count()).toBe(2);expect(JSON.parse(raw).tasks).toEqual((await db.tasks.toArray()))});
it('не меняет базу при испорченной копии',async()=>{await db.tasks.add(task());await expect(restoreBackup('{"app":"MyControl","version":99}')).rejects.toThrow();expect(await db.tasks.count()).toBe(1)});
it('запрещает повторяющиеся id и будущие версии',()=>{const t=task(),b={app:'MyControl',version:1,exportedAt:new Date().toISOString(),tasks:[t,t],settings:defaultSettings};expect(backupSchema.safeParse(b).success).toBe(false);expect(backupSchema.safeParse({...b,version:2,tasks:[]}).success).toBe(false)});
it('экспортирует ICS с экранированием, датами и повторением',()=>{const ics=toICS([task()]);expect(ics).toContain('DTSTART:20260131T123000');expect(ics).toContain('RRULE:FREQ=MONTHLY;BYMONTHDAY=31,-1;BYSETPOS=1');expect(ics).toContain('План\\; закупки\\, оплата\\nДетали');expect(ics).toContain('\r\nEND:VCALENDAR\r\n')});
});
