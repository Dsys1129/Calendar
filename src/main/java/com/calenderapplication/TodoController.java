package com.calenderapplication;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class TodoController {

    private final TodoService todoService;

    @GetMapping("/")
    public String renderIndexPage() {
        return "calender";
    }

    @PostMapping("/todos")
    public ResponseEntity<?> creatTodo(@RequestBody TodoRequestDTO requestDTO) {
        Map<String, String> response = todoService.createTodo(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/todos/{date}")
    public ResponseEntity<?> getTodoList(@PathVariable String date) {
        Map<String, List<Todo>> response = todoService.getTodoList(date);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/todos/{id}/complete")
    public ResponseEntity<?> completeTodo(@PathVariable Long id) {
        Map<String, String> response = todoService.completeTodo(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        Map<String, String> response = todoService.deleteTodo(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
