import type { ITaskResponse } from "../types/common";

export class TaskModel {
  color: number;
  endTime: string | null;
  attachments: any[];
  totalChecklistItemsCount: number;
  tracking: string | null;
  estimateType: string;
  createdAt: string;
  colorId: number;
  id: number;
  planStatusPosition: string | null;
  parentId: string | null;
  updatedBy: number;
  name: string;
  hasNotes: boolean;
  visibleProperties: string[];
  startDate: string;
  tagIds: string[];
  dailyEstimatedMinutes: number | null;
  comments: any[];
  tracked: boolean;
  status: string;
  timelineSegmentId: number;
  repetitionRule: string | null;
  done: boolean;
  updatedAt: string;
  endDate: string;
  startTime: string | null;
  estimatedMinutes: number;
  folderId: string | null;
  weight: number;
  estimateSkipsWeekend: boolean;
  workspaceMembers: number[];
  doneChecklistItemsCount: number;
  isLastRepetition: boolean;
  taskType: string;
  originalRepeatedTaskId: string | null;
  planId: number;
  createdBy: number;

  constructor(response: ITaskResponse) {
    this.color = response.color;
    this.endTime = response.end_time;
    this.attachments = response.attachments;
    this.totalChecklistItemsCount = response.total_checklist_items_count;
    this.tracking = response.tracking;
    this.estimateType = response.estimate_type;
    this.createdAt = response.created_at;
    this.colorId = response.color_id;
    this.id = response.id;
    this.planStatusPosition = response.plan_status_position;
    this.parentId = response.parent_id;
    this.updatedBy = response.updated_by;
    this.name = response.name;
    this.hasNotes = response.has_notes;
    this.visibleProperties = response.visible_properties;
    this.startDate = response.start_date;
    this.tagIds = response.tag_ids;
    this.dailyEstimatedMinutes = response.daily_estimated_minutes;
    this.comments = response.comments;
    this.tracked = response.tracked;
    this.status = response.status;
    this.timelineSegmentId = response.timeline_segment_id;
    this.repetitionRule = response.repetition_rule;
    this.done = response.done;
    this.updatedAt = response.updated_at;
    this.endDate = response.end_date;
    this.startTime = response.start_time;
    this.estimatedMinutes = response.estimated_minutes;
    this.folderId = response.folder_id;
    this.weight = response.weight;
    this.estimateSkipsWeekend = response.estimate_skips_weekend;
    this.workspaceMembers = response.workspace_members;
    this.doneChecklistItemsCount = response.done_checklist_items_count;
    this.isLastRepetition = response.is_last_repetition;
    this.taskType = response.task_type;
    this.originalRepeatedTaskId = response.original_repeated_task_id;
    this.planId = response.plan_id;
    this.createdBy = response.created_by;
  }
  
  getDaysStartDateEndDateDiff(): number {
    return Math.ceil(
      (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) /
      (24 * 60 * 60 * 1000)
    ) + 1
  }

}