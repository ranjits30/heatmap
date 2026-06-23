package com.heatmap.controller;

import com.heatmap.entity.EmployeeProfile;
import com.heatmap.repository.EmployeeProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EmployeeProfileRepository employeeProfileRepository;

    @GetMapping("/employees")
    public List<EmployeeProfile> getEmployees() {
        return employeeProfileRepository.findAll();
    }
}
