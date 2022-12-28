/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Roles;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface RoleRepository extends JpaRepository<Roles, Integer>{

}
