package com.roima.learn.application.service;

import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.UserResponseDto;

public interface UserService {
    UserResponseDto getUser(int pageNumber, int pageSize);
    UserDto getUserById(int id);
    UserDto createUser(UserDto userDto);
    UserDto updateUser(int id, UserDto userDto);
    void deleteUser(int id);
}
