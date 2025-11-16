/**
 * SQL query templates
 * Parameterized queries to prevent SQL injection
 */

export const QUERIES = {
  // Sleep logs CRUD
  CREATE_SLEEP_LOG: `
    INSERT INTO sleep_logs (
      user_id,
      sleep_date,
      slept_at,
      woke_at,
      notes,
      quality_rating
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  GET_SLEEP_LOG_BY_ID: `
    SELECT * FROM sleep_logs
    WHERE id = $1 AND user_id = $2
  `,

  GET_SLEEP_LOGS_LIST: `
    SELECT * FROM sleep_logs
    WHERE user_id = $1
      AND ($2::date IS NULL OR sleep_date >= $2)
      AND ($3::date IS NULL OR sleep_date <= $3)
    ORDER BY sleep_date DESC, slept_at DESC
    LIMIT $4
  `,

  UPDATE_SLEEP_LOG: `
    UPDATE sleep_logs
    SET
      sleep_date = COALESCE($2, sleep_date),
      slept_at = COALESCE($3, slept_at),
      woke_at = COALESCE($4, woke_at),
      notes = COALESCE($5, notes),
      quality_rating = COALESCE($6, quality_rating),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $7
    RETURNING *
  `,

  DELETE_SLEEP_LOG: `
    DELETE FROM sleep_logs
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `,

  COUNT_SLEEP_LOGS: `
    SELECT COUNT(*) as count
    FROM sleep_logs
    WHERE user_id = $1
      AND ($2::date IS NULL OR sleep_date >= $2)
      AND ($3::date IS NULL OR sleep_date <= $3)
  `,

  // Statistics queries
  GET_AVERAGE_DURATION: `
    SELECT 
      ROUND(AVG(duration_minutes)::numeric, 2) as avg_duration
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
  `,

  GET_AVERAGE_QUALITY: `
    SELECT 
      ROUND(AVG(quality_rating)::numeric, 2) as avg_quality
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
      AND quality_rating IS NOT NULL
  `,

  GET_BEST_DAY: `
    SELECT 
      sleep_date,
      duration_minutes,
      quality_rating
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
    ORDER BY 
      duration_minutes DESC,
      quality_rating DESC NULLS LAST
    LIMIT 1
  `,

  GET_WORST_DAY: `
    SELECT 
      sleep_date,
      duration_minutes,
      quality_rating
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
    ORDER BY 
      duration_minutes ASC,
      quality_rating ASC NULLS LAST
    LIMIT 1
  `,

  GET_WEEKLY_BREAKDOWN: `
    SELECT 
      DATE_TRUNC('week', sleep_date) as week_start,
      ROUND(AVG(duration_minutes)::numeric, 2) as avg_duration,
      ROUND(AVG(quality_rating)::numeric, 2) as avg_quality,
      COUNT(*) as session_count
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
    GROUP BY DATE_TRUNC('week', sleep_date)
    ORDER BY week_start DESC
  `,

  GET_SLEEP_QUALITY_TREND: `
    SELECT 
      sleep_date,
      quality_rating,
      duration_minutes
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
      AND quality_rating IS NOT NULL
    ORDER BY sleep_date ASC
  `,

  GET_TOTAL_SESSIONS: `
    SELECT COUNT(*) as total
    FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date >= $2
      AND sleep_date <= $3
  `,

  // Utility queries
  CHECK_DUPLICATE: `
    SELECT id FROM sleep_logs
    WHERE user_id = $1
      AND sleep_date = $2
      AND slept_at = $3
    LIMIT 1
  `,

  GET_LATEST_SLEEP_LOG: `
    SELECT * FROM sleep_logs
    WHERE user_id = $1
    ORDER BY sleep_date DESC, slept_at DESC
    LIMIT 1
  `,
} as const;
