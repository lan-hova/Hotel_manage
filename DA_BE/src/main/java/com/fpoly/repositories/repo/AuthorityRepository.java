/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Authority;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Integer>{

}
