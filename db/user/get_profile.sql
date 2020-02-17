select * from users u
join liked l on u.user_id = l.user_id
join games g on l.game_id = g.game_id
where u.user_id = $1