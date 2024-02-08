import type { TaskModel } from "../models/task_model";

export interface IFetchTasksQueryParams {
    since: string;
    until: string;
    short: boolean;
    team: number;
    [key: string]: string | number | boolean;
}

export interface ITaskResponse {
    end_time: null | string;
    parent_id: null | string;
    task_type: string;
    tracking: null | string;
    color_id: number;
    visible_properties: string[];
    id: number;
    done_checklist_items_count: number;
    comments: any[];
    has_notes: boolean;
    estimate_type: string;
    daily_estimated_minutes: null | number;
    folder_id: null | string;
    name: string;
    is_last_repetition: boolean;
    tracked: boolean;
    attachments: any[];
    created_at: string;
    status: string;
    color: number;
    updated_at: string;
    done: boolean;
    end_date: string;
    repetition_rule: null | string;
    workspace_members: number[];
    estimate_skips_weekend: boolean;
    start_time: null | string;
    total_checklist_items_count: number;
    tag_ids: string[];
    plan_id: number;
    estimated_minutes: number;
    created_by: number;
    plan_status_position: null | string;
    timeline_segment_id: number;
    original_repeated_task_id: null | string;
    updated_by: number;
    weight: number;
    start_date: string;
}

export interface ITasksStoreState {
    tasks: TaskModel[];
}

export interface IGroupedTimelineItemsMap { [x: string]: TaskModel[] }
