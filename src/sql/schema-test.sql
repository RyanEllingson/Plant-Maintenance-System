drop database if exists maintenance_test;
create database maintenance_test;
use maintenance_test;

create table roles (
    role_id int primary key auto_increment,
    role_name varchar(30) not null
);

create table users (
    user_id int primary key auto_increment,
    first_name varchar(30) not null,
    last_name varchar(50) not null,
    email varchar(50) unique not null,
    password varchar(50) not null,
    password_needs_reset boolean default true,
    roleId int not null,
    constraint fk_user_roleId
        foreign key (roleId)
        references roles(role_id)
);

insert into roles (role_name) values ("admin"), ("planner"), ("maintenance"), ("operations"), ("engineering");

delimiter //
create procedure set_known_good_state()
begin

    delete from users;
    alter table users auto_increment = 1;

    insert into users(first_name, last_name, email, password, roleId) values ("testy", "testerson", "test1@test.com", "password", 1);
    insert into users(first_name, last_name, email, password, roleId) values ("testus", "testerino", "test2@test.com", "password", 2);

end //
delimiter ;