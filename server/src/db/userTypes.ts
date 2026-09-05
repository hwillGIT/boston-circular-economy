/** User columns read by authentication queries. Nullable fields match the SQLite schema. */
export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
  neighborhood: string | null;
  verified: number | null;
  status: string;
  created_at: string | null;
}

/** User identity returned by a valid session. Password and token hashes stay in storage. */
export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  avatarColor: string | null;
  role: string;
  neighborhood: string | null;
  verified: number | null;
  status: string;
  joinedAt: string | null;
}
