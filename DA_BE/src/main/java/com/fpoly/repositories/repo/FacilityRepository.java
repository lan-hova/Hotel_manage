/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Facilities;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface FacilityRepository extends JpaRepository<Facilities, Integer>{

}
