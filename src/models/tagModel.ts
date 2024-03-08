import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {TagResult} from '@/types/DBTypes';
import promisePool from '@/lib/db';
import {fetchData} from '@/lib/functions';
import {MessageResponse} from '@/types/MessageTypes';
import { Tag } from '@/types/DBTypes';

// Request a list of tags
const fetchAllTags = async (): Promise<TagResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & TagResult[]>(
      `SELECT Tags.tag_id, Tags.tag_name, MediaItemTags.book_id
       FROM Tags
       JOIN MediaItemTags ON Tags.tag_id = MediaItemTags.tag_id`
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllTags error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Post a new tag
const postTag = async (
  tag_name: string,
  media_id: number,
): Promise<MessageResponse | null> => {
  try {
    let tag_id = 0;
    // check if tag exists (case insensitive)
    const [tagResult] = await promisePool.query<RowDataPacket[] & Tag[]>(
      'SELECT tag_id FROM Tags WHERE tag_name = ?',
      [tag_name],
    );
    if (tagResult.length === 0) {
      // if tag does not exist create it
      const [insertResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Tags (tag_name) VALUES (?)',
        [tag_name],
      );
      if (insertResult.affectedRows === 0) {
        return null;
      }
      // get tag_id from created tag
      tag_id = insertResult.insertId;
    } else {
      // if tag exists get tag_id from the first result
      tag_id = tagResult[0].tag_id;
    }
    const [MediaItemTagsResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO MediaItemTags (tag_id, media_id) VALUES (?, ?)',
      [tag_id, media_id],
    );
    if (MediaItemTagsResult.affectedRows === 0) {
      return null;
    }

    return { message: 'Tag added' };
  } catch (e) {
    console.error('postTagToMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of media items by tag
const fetchMediaByTag = async (tag: string): Promise<TagResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & TagResult[]>(
      `SELECT Tags.tag_id, Tags.tag_name, MediaItemTags.book_id
       FROM Tags
       JOIN MediaItemTags ON Tags.tag_id = MediaItemTags.tag_id
       WHERE Tags.tag_name = ?`,
      [tag]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchMediaByTag error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of tags by media item id
const fetchTagsByMediaId = async (id: number): Promise<TagResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & TagResult[]>(
      `SELECT Tags.tag_id, Tags.tag_name, MediaItemTags.book_id
       FROM Tags
       JOIN MediaItemTags ON Tags.tag_id = MediaItemTags.tag_id
       WHERE MediaItemTags.book_id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchTagsByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Delete a tag
const deleteTag = async (id: number): Promise<MessageResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    const [tagResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Tags WHERE tag_id = ?',
      [id]
    );
    if (tagResult.affectedRows === 0) {
      return null;
    }

    const [mediaItemTagResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM MediaItemTags WHERE tag_id = ?',
      [id]
    );

    await connection.commit();

    if (mediaItemTagResult.affectedRows === 0) {
      return null;
    }

    return {message: 'Tag deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('deleteTag error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

export {fetchAllTags, postTag, fetchMediaByTag, fetchTagsByMediaId, deleteTag};
