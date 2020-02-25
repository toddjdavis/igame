delete from games
where game_id = $1;
select * from games;