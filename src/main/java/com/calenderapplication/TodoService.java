package com.calenderapplication;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class TodoService {

    private final TodoMapper todoMapper;

    public Map<String, String> createTodo(TodoRequestDTO requestDTO) {
        Todo todo = new Todo(requestDTO.getDate(), requestDTO.getText(), requestDTO.getStatus());
        todoMapper.save(todo);

        return Collections.singletonMap("message", "등록 성공");
    }

    public Map<String, List<Todo>> getTodoList(String date) {
        List<Todo> todoListByDate = todoMapper.findTodosBy(date);

        return Collections.singletonMap("data", todoListByDate);
    }

    public Map<String, String> deleteTodo(Long id) {
        todoMapper.deleteTodoBy(id);
        return Collections.singletonMap("message", "삭제 성공");
    }

    public Map<String, String> completeTodo(Long id) {
        todoMapper.completeTodoBy(id);
        return Collections.singletonMap("message", "완료 처리 성공");
    }
}
