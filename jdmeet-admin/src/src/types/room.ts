export type RoomType = "education" | "meeting" | "webinar";

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  password?: string;
  allowGuest: boolean;
  roomLink: string;
  active: boolean;
}