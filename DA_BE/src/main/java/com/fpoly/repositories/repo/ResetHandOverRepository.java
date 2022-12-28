/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.ResetHandOver;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface ResetHandOverRepository extends JpaRepository<ResetHandOver, Integer>{

}
