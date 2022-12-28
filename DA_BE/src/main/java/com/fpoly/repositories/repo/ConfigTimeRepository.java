package com.fpoly.repositories.repo;

import com.fpoly.entities.ConfigTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigTimeRepository extends JpaRepository<ConfigTime, Integer> {
}
