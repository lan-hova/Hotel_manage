/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.NumberOfFloors;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface NumberOfFloorRepository extends JpaRepository<NumberOfFloors, Integer>{

}
