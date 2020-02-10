insert into users (
    email,
    password,
    user_picture
) values(
    $1,
    $2,
    $3
);
select * from users
where email = $1;