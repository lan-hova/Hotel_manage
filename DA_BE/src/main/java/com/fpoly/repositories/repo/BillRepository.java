/**
 * 
 */
package com.fpoly.repositories.repo;

import com.fpoly.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Bills;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface BillRepository extends JpaRepository<Bills, Integer>{
    @Query("select entity from Bills entity Where customer = :customer")
    public List<Bills> getBillByCustomer(@Param("customer") Optional<Customer> customer);
    List<Bills> findByStatus (Integer status);

    @Query("select b from Bills b where b.booking.id = :idBooking")
    Bills getBillByIdBooking(@Param("idBooking") Integer idBooking);
}
