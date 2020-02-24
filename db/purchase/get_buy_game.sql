select * from games g
join purchase p on p.game_id = p.game_id
where g.game_id = $1