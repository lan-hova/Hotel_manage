/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.HandOver;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface HandOverRepository extends JpaRepository<HandOver, Integer>{

}
