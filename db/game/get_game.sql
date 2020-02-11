select * from games g
join users u on g.user_id = u.user_id
where g.game_id = $1;