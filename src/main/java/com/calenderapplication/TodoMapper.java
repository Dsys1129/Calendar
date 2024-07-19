package com.calenderapplication;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TodoMapper {
    void save(Todo todo);

    List<Todo> findTodosBy(String date);

    void deleteTodoBy(Long id);

    void completeTodoBy(Long id);
}
