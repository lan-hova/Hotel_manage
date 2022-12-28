/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Personnel;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Integer>{
    @Query("select p from Personnel p where p.users.username = :userName")
    Personnel getPersonnelByUserName(@Param("userName") String userName);
}
