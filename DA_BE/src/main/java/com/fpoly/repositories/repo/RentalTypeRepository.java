/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.RentalTypes;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface RentalTypeRepository extends JpaRepository<RentalTypes, Integer>{

}
