/**
 *
 * @author Алексей
 * @name qShotsInPeriod
 * @public 
 */ 
Select * 
From mtk_shots t1
 Where :period_end >= t1.shot_time
 and :period_start < t1.shot_time