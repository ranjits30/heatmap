package com.heatmap.repository;

import com.heatmap.entity.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {
    Optional<EmployeeProfile> findByEmployeeId(String employeeId);
}
