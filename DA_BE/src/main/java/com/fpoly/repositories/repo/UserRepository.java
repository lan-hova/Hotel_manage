/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Users;

/**
 *
 * @author trucnv
 *
 */
@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

	@Query("SELECT u FROM Users u WHERE u.username =:username")
	public Users findByUsernameEquals(@Param("username") String username);

}
