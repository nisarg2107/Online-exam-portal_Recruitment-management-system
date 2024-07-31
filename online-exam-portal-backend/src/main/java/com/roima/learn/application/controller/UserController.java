package com.roima.learn.application.controller;

import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.payload.response.UserResponseDto;
import com.roima.learn.application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
//@AllArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<UserResponseDto> getUsers(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.userService.getUser(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable int id) {

        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    @PostMapping("/")
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(this.userService.createUser(userDto),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable int id, @RequestBody UserDto userDto) {
        return new ResponseEntity<>(this.userService.updateUser(id, userDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteUser(@PathVariable int id) {
        this.userService.deleteUser(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
