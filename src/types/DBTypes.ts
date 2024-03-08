type UserLevel = {
  level_id: number;
  level_name: "Admin" | "User" | "Guest";
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  created_at: Date | string;
};

type MediaItem = {
  book_id: number;
  user_id: number;
  filename: string;
  book_genre: string;
  series_name: string;
  thumbnail: string;  
  filesize: number;
  media_type: string;
  title: string;
  description: string | null;
  created_at: Date | string;
};

type Comment = {
  comment_id: number;
  book_id: number;
  user_id: number;
  comment_text: string;
  created_at: Date;
};

type Like = {
  like_id: number;
  book_id: number;
  user_id: number;
  created_at: Date;
};

type Rating = {
  rating_id: number;
  book_id: number;
  user_id: number;
  rating_value: number;
  created_at: Date;
};

type Review = {
  review_id: number;
  book_id: number;
  user_id: number;
  review_text: string;
  created_at: Date;
};

type Tag = {
  tag_id: number;
  tag_name: string;
};

type MediaItemTag = {
  book_id: number;
  tag_id: number;
};

type ReadingStatus = {
  status_id: number;
  status_name: string;
};

type BookStatus = {
  book_id: number;
  status_id: number;
  user_id: number;
};

type StatusColors = {
  [key in 'Reading' | 'Read' | 'Dropped' | 'Want to Read' | 'Paused']: string;
};


type BookGroup ={
  [series: string]: MediaItemWithOwner[];
}

type reviewResult = Review & Rating;
type bookList = MediaItem & ReadingStatus;
type statusResult = ReadingStatus & BookStatus;
type TagResult = MediaItemTag & Tag;

type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

type MostLikedMedia = Pick<
  MediaItem,
  | "book_id"
  | "filename"
  | "filesize"
  | "media_type"
  | "title"
  | "description"
  | "created_at"
> &
  Pick<User, "user_id" | "username" | "email" | "created_at"> & {
    likes_count: bigint;
  };

// type gymnastics to get rid of user_level_id from User type and replace it with level_name from UserLevel type
type UserWithLevel = Omit<User, "user_level_id"> &
  Pick<UserLevel, "level_name">;

type UserWithNoPassword = Omit<UserWithLevel, "password">;

type TokenContent = Pick<User, "user_id"> & Pick<UserLevel, "level_name">;

type MediaItemWithOwner = MediaItem & Pick<User, "username">;

// type MediaItemWithOwner = MediaItem & {
//   owner: User;
//   likes?: Like[];
//   rating?: Rating;
//   review?: Review;
//   likes_count: number;
//   status: ReadingStatus;
// };


// for upload server
type FileInfo = {
  filename: string;
  user_id: string;
};

export type {
  UserLevel,
  User,
  MediaItem,
  Comment,
  Like,
  Rating,
  Tag,
  ReadingStatus,
  MediaItemTag,
  TagResult,
  UploadResult,
  MostLikedMedia,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
  MediaItemWithOwner,
  FileInfo,
  statusResult,
  bookList,
  reviewResult,
  Review,
  BookStatus,
  BookGroup,
  StatusColors
};
