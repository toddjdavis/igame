delete from games
where game_id = $1 and user_id = $2;
select * from games;