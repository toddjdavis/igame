update users
set email = $1
where user_id = $2;
select * from users
where user_id = $2;