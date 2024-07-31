package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Role;
import com.roima.learn.application.payload.RoleDto;
import com.roima.learn.application.payload.response.RoleResponseDto;
import com.roima.learn.application.repository.RoleRepository;
import com.roima.learn.application.service.RoleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoleResponseDto getRole(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Role> pageRole = this.roleRepository.findAll(pageable);

        List<RoleDto> roleDtoList = pageRole
                .getContent()
                .stream()
//                .map(role -> this.modelMapper.map(role,RoleDto.class))
                .map(CustomMapper.MAPPER::mapToRoleDto)
                .collect(Collectors.toList());

        RoleResponseDto roleResponseDto = new RoleResponseDto();
        roleResponseDto.setContent(roleDtoList);
        roleResponseDto.setPageNumber(pageNumber + 1);
        roleResponseDto.setPageSize(pageSize);
        roleResponseDto.setTotalElements(pageRole.getTotalElements());
        roleResponseDto.setTotalPages(pageRole.getTotalPages());
        roleResponseDto.setLastPage(pageRole.isLast());
        return roleResponseDto;
    }

    @Override
    public RoleDto getRoleById(int id) {
        Role role = this.roleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Role not found with id : "+id));
//        return this.modelMapper.map(role,RoleDto.class);
        return CustomMapper.MAPPER.mapToRoleDto(role);
    }

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        Role role = new Role();
        role.setType(roleDto.getType());
        Role createdRole = this.roleRepository.save(role);
//        return this.modelMapper.map(createdRole,RoleDto.class);
        return CustomMapper.MAPPER.mapToRoleDto(createdRole);
    }

    @Override
    public RoleDto updateRole(int id, RoleDto roleDto) {
        Role role = this.roleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Role not found with id : "+id));
        role.setType(roleDto.getType());
        Role updatedRole = this.roleRepository.save(role);
//        return this.modelMapper.map(updatedRole,RoleDto.class);
        return CustomMapper.MAPPER.mapToRoleDto(updatedRole);
    }

    @Override
    public void deleteRole(int id) {
        if (this.roleRepository.existsById(id)) this.roleRepository.deleteById(id);
        else {
            throw new NoSuchElementException("Role not found with id : " + id);
        }
    }
}
