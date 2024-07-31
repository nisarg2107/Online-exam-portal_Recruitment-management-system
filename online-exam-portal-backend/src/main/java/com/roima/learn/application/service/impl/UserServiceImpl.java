package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Role;
import com.roima.learn.application.model.User;
import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.UserResponseDto;
import com.roima.learn.application.repository.RoleRepository;
import com.roima.learn.application.repository.UserRepository;
import com.roima.learn.application.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserResponseDto getUser(int pageNumber, int pageSize) {

        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<User> pageUser = this.userRepository.findAll(pageable);

        List<UserDto> userDtoList = pageUser.getContent()
                .stream()
//                .map(user -> this.modelMapper.map(user, UserDto.class))
                .map(CustomMapper.MAPPER::mapToUserDto)
                .collect(Collectors.toList());

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setContent(userDtoList);
        userResponseDto.setPageNumber(pageNumber + 1);
        userResponseDto.setPageSize(pageSize);
        userResponseDto.setTotalElements(pageUser.getTotalElements());
        userResponseDto.setTotalPages(pageUser.getTotalPages());
        userResponseDto.setLastPage(pageUser.isLast());
        return userResponseDto;
    }

    @Override
    public UserDto getUserById(int id) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id : "+id));
//        return this.modelMapper.map(user, UserDto.class);
        return CustomMapper.MAPPER.mapToUserDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        if (this.userRepository.existsByEmail(userDto.getEmail())) {
            throw new NoSuchElementException("User already exists with email: "+userDto.getEmail());
        }
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setActive(true);

        if (userDto.getRole() != null && userDto.getRole().getId() > 0) {
            if (this.roleRepository.existsById(userDto.getRole().getId())) {
                user.setRole(
                        this.roleRepository.findById(userDto.getRole().getId())
                                .orElseThrow(() -> new NoSuchElementException("Role not found with id: "+userDto.getRole().getId()))
                );

            }
        } else {
            Role role = this.roleRepository.findByTypeContainingIgnoreCase("ROLE_USER").get(0);
            if (role.getId() > 0) {
                user.setRole(role);
            }
            else {
                throw new NoSuchElementException("ROLE_USER not found...");
            }
        }

        User createdUser = this.userRepository.save(user);
//        UserDto map = this.modelMapper.map(createdUser, UserDto.class);
//        System.out.println(map.toString());
//        return map;
        return CustomMapper.MAPPER.mapToUserDto(createdUser);
    }

    @Override
    public UserDto updateUser(int id, UserDto userDto) {
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id : "+id));
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
//        user.setPassword(userDto.getPassword());
//        user.setActive(true);

        if (userDto.getRole() != null && userDto.getRole().getId() > 0) {
            if (this.roleRepository.existsById(userDto.getRole().getId())) {
                user.setRole(
                        this.roleRepository.findById(userDto.getRole().getId())
                                .orElseThrow(() -> new NoSuchElementException("Role not found with id: "+userDto.getRole().getId()))
                );

            }
        } else {
            Role role = this.roleRepository.findByTypeContainingIgnoreCase("ROLE_USER").get(0);
            if (role.getId() > 0) {
                user.setRole(role);
            }
            else {
                throw new NoSuchElementException("ROLE_USER not found...");
            }
        }

        User updatedUser = this.userRepository.save(user);
//        return this.modelMapper.map(updatedUser, UserDto.class);
        return CustomMapper.MAPPER.mapToUserDto(updatedUser);
    }

    @Override
    public void deleteUser(int id) {

        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id : " + id));

//        this.userRepository.delete(user);
        user.setActive(!user.isActive());
        this.userRepository.save(user);
    }
}
