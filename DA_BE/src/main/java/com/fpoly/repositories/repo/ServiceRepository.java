/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Servicess;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface ServiceRepository extends JpaRepository<Servicess, Integer>{

}
