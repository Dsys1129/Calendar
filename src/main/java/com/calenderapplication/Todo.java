package com.calenderapplication;

import lombok.Getter;

@Getter
public class Todo {
    private Long id;
    private String date;
    private String text;
    private String status;

    public Todo(String date, String text, String status) {
        this.date = date;
        this.text = text;
        this.status = status;
    }
}
