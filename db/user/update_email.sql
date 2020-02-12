update users
set email = $1,user_picture = $3
where user_id = $2;
select * from users
where user_id = $2;