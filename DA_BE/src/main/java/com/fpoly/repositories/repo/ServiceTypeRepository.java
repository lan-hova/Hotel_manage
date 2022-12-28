/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.ServiceType;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Integer>{

}
