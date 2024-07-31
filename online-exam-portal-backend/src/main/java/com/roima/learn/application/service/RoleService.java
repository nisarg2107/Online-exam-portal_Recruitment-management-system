package com.roima.learn.application.service;

import com.roima.learn.application.payload.RoleDto;
import com.roima.learn.application.payload.response.RoleResponseDto;

public interface RoleService {
    RoleResponseDto getRole(int pageNumber, int pageSize);
    RoleDto getRoleById(int id);
    RoleDto createRole(RoleDto roleDto);
    RoleDto updateRole(int id, RoleDto roleDto);
    void deleteRole(int id);
}
