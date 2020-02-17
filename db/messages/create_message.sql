insert into messages (
    chatroom_id,
    user_id,
    message,
    email
) values (
    $1, $2, $3, (select email from users
    where user_id = $2)
)
returning *;