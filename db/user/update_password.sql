update users
set PASSWORD = $1
where user_id = $2;