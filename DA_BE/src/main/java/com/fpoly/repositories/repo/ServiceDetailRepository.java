/**
 * 
 */
package com.fpoly.repositories.repo;

import com.fpoly.entities.DetailsInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.ServiceDetails;

import java.util.List;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface ServiceDetailRepository extends JpaRepository<ServiceDetails, Integer>{
    @Query("select sd from ServiceDetails sd where sd.detailsInvoice = :dedetailsInvoice and sd.status = :status")
    List<ServiceDetails> listByRoomAndStatus(@Param("dedetailsInvoice") DetailsInvoice detailsInvoice, @Param("status") Integer status);
}
