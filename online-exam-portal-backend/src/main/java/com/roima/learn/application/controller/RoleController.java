package com.roima.learn.application.controller;

import com.roima.learn.application.payload.RoleDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.payload.response.RoleResponseDto;
import com.roima.learn.application.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/role")
//@AllArgsConstructor
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/")
    public ResponseEntity<RoleResponseDto> getRoles(

            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.roleService.getRole(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable int id) {

        return ResponseEntity.ok(this.roleService.getRoleById(id));
    }

    @PostMapping("/")
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {
        return new ResponseEntity<>(this.roleService.createRole(roleDto),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDto> updateRole(@PathVariable int id, @RequestBody RoleDto roleDto) {
        return new ResponseEntity<>(this.roleService.updateRole(id, roleDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteRole(@PathVariable int id) {
        this.roleService.deleteRole(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
