update users
set admin = TRUE
where user_id = $1;
select * from users
where user_id = $1