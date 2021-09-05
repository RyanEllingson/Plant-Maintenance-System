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
    password_needs_reset boolean default false,
    role_id int not null,
    constraint fk_user_role_id
        foreign key (role_id)
        references roles(role_id)
);

insert into roles (role_name) values ("admin"), ("planner"), ("mainenance"), ("operations"), ("engineering");